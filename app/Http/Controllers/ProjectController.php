<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProjectPostRequest;
use App\Models\ChecklistTemplate;
use App\Models\Phase;
use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Http\Request;
use F9Web\ApiResponseHelpers;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use function League\Flysystem\type;
use function Spatie\Ignition\Config\toArray;

class ProjectController extends Controller
{
    use ApiResponseHelpers;


    public function getProjectOverview(Request $request)
    {
        $response = Project::with(['checklistProjects', 'phases'=> fn($q) => $q->where('phase_project.active', '=', 1 )])
            ->get();

        return $this->filterDataForProjectTable($response);
    }


    public function getTopTenProjects()
    {
        $projects = Project::with(['checklistProjects', 'phases'])
            ->orderBy('deadline')
            ->take(10)
            ->get();

        $filteredData = $this->filterDataForProjectTable($projects);

        return $this->respondWithSuccess($filteredData);
    }


    private function filterDataForProjectTable($projects)
    {
        return $projects->map(function ($project) {
            $activePhase = $project->phases->first(function ($phase) {
                return $phase->pivot->active === 1;
            });

            $activePhaseId = optional($activePhase)->pivot->phase_id;
            $activePhaseDeadline = optional($activePhase)->pivot->deadline;

            $project->active_phase_id = $activePhaseId;
            $project->active_phase_deadline = $activePhaseDeadline ? Carbon::createFromFormat('Y-m-d', $activePhaseDeadline)->format('d/m/Y') : null;

            $activeChecks = $project->checklistProjects->where('phase_id', $activePhaseId)->count();
            $checked = $project->checklistProjects->where('phase_id', $activePhaseId)->where('question_checked', 1)->count();

            $project->progress = $activeChecks > 0 ? ($checked / $activeChecks) * 100 : 0;

            return $project;
        });
    }








//    public function getTopTenProjects()
//    {
//        $response = Project::with(['checklistProjects', 'phases'=> fn($q) => $q->where('phase_project.active', '=', 1 )])
//            ->orderBy('deadline')
//            ->take(10)
//            ->get();
//
//        return $this->filterDataForProjectTable($response);
//    }
//
//    private function filterDataForProjectTable($response)
//    {
//        $data = json_decode($response, true);
//
//        foreach ($data as $key => $project) {
//            foreach ($project['phases'] as $phase) {
//                if ($phase['pivot']['active'] === 1) {
//                    $data[$key]['active_phase_id'] = $phase['pivot']['phase_id'];
//                    $data[$key]['active_phase_deadline'] = \Carbon\Carbon::createFromFormat('Y-m-d', $phase['pivot']['deadline'])->format('d/m/Y');
//                }
//            }
//        }
//
//        foreach ($data as $key => $project){
//            $activeChecks = 0;
//            $checked = 0;
//            foreach ($project['checklist_projects'] as $checklist){
//                if ((array_key_exists('active_phase_id', $project)) && $checklist['phase_id'] == $project['active_phase_id']){
//                    $activeChecks++;
//                    if ($checklist['question_checked'] == 1){
//                        $checked++;
//                    }
//                }
//            }
//            $data[$key]['progress'] = (($checked / $activeChecks * 10000)/100);
//        }
//        return $this->respondWithSuccess($data);
//    }

//
//    public function projectTimeline(Project $project)
//    {
//        //$findProject = Project::findOrFail($project->id)->makeHidden(['name', 'state', 'deadline', 'created_at', 'updated_at', 'deleted_at', 'user_id']);
//
//        $data = Project::with('phases', 'user')->findOrFail(['id'=> $project->id]);
//
//        $filteredData = collect(json_decode($data, true))->map(function ($item) {
//            $phases = collect($item['phases'])
//                ->sortBy('pivot.phase_id')
//                ->map(function ($phase) use ($item) {
//                    return [
//                        'user_name' => $item['user']['name'],
//                        'name' => $item['name'],
//                        'project_deadline' => $item['deadline']= \Carbon\Carbon::createFromFormat('Y-m-d', $item['deadline'])->format('d/m/Y'),
//                        'phase_name' => $phase['phase_name'],
//                        'phase_id' => $phase['pivot']['phase_id'],
//                        'project_id' => $phase['pivot']['project_id'],
//                        'active' => $phase['pivot']['active'],
//                        'deadline' => $phase['pivot']['deadline']= \Carbon\Carbon::createFromFormat('Y-m-d', $phase['pivot']['deadline'])->format('d/m/Y')
//                    ];
//                });
//
//            return $phases;
//        })->flatten(1);
//
//        return $this->respondWithSuccess($filteredData);
//    }

//    public function storeProject(Request $request)
//    {
//        $template = ChecklistTemplate::select('id', 'phase_id')->get();
//        $attributes = $template->map(function ($item) {
//            return [
//                'checklist_template_id' => $item->id,
//                'phase_id' => $item->phase_id,
//                'question_checked' => 0,
//                'comment' => ''
//            ];
//        })->all();
//
//
//        $project = new Project($request->all());
//        $project->user_id = $request->user_id;
//        $project->save();
//
//        Project::findorfail($project->id)->phases()->sync($request->phases);
//
//        Project::findorfail($project->id)->checklistProjects()->createMany($attributes);
//
//        //return response()->json(['message' => 'The project has been created'], 201);
//        return $this->respondOk('The project has been created');
//    }













    public function getHomeProject()
    {
        $projectId = Project::join('phase_project', 'projects.id', '=', 'phase_project.project_id')
            ->join('phases', 'phase_project.phase_id', '=', 'phases.id')
            ->where('phase_project.active', '=', 1)
            ->orderBy('phase_project.deadline', 'asc')
            ->first('projects.id');

        $data = Project::with('phases')->findOrFail($projectId);

        $filteredData = collect(json_decode($data, true))->map(function ($item) {
            $phases = collect($item['phases'])->map(function ($phase) use ($item) {
                return [
                    'name' => $item['name'],
                    'phase_name' => $phase['phase_name'],
                    'phase_id' => $phase['pivot']['phase_id'],
                    'project_id' => $phase['pivot']['project_id'],
                    'active' => $phase['pivot']['active'],
                    'deadline' => $phase['pivot']['deadline']= \Carbon\Carbon::createFromFormat('Y-m-d', $phase['pivot']['deadline'])->format('d/m/Y')
                ];
            });

            return $phases;
        })->flatten(1);

        return $this->respondWithSuccess($filteredData);
    }


    public function storeProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:40',
            'deadline' => 'required|date|after:today',
            'user_id' => 'required|exists:users,id',
            'phases' => 'required|array',
            'phases.*.phase_id' => 'required|exists:phases,id',
            'phases.*.deadline' => 'required|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $checklistTemplates = ChecklistTemplate::select('id', 'phase_id')->get();
        $checklistItems = $this->createChecklistItems($checklistTemplates);

        $project = new Project($request->all());
        $project->save();

        $project->phases()->sync($request->phases);

        $project->checklistProjects()->createMany($checklistItems);

        return $this->respondOk('The project has been created');
    }

    private function createChecklistItems($checklistTemplates)
    {
        return $checklistTemplates->map(function ($template) {
            return [
                'checklist_template_id' => $template->id,
                'phase_id' => $template->phase_id,
                'question_checked' => 0,
                'comment' => ''
            ];
        })->all();
    }


    public function getProjectChecklistTemplate(Project $project)
    {
        $groupedData = $this->groupChecksByPhase($project->id);

        $transformedData = $groupedData->map(function ($items, $phaseId) {
            return [
                'phase_id' => $phaseId,
                'items' => $items->map(function ($item) {
                    return [
                        'id' => $item['id'],
                        'checklist_template_id' => $item['checklist_template_id'],
                        'phase_id' => $item['phase_id'],
                        'question' => $item['checklist_template']['question'],
                    ];
                })->toArray(),
            ];
        })->values()->toArray();

        return $this->respondWithSuccess($transformedData);
    }


    public function configureProjectChecklistTemplate(Project $project, Request $request)
    {
        Project::findorfail($project->id)->checklistProjects()->delete();

        Project::findorfail($project->id)->checklistProjects()->createMany($request->data);

        return $this->respondOk('The project checklist has been configured');
    }


    public function projectTimeline(Project $project)
    {
        $projectData = Project::with('phases', 'user')->findOrFail(['id' => $project->id]);

        $filteredData = collect(json_decode($projectData, true))->map(function ($item) {
            return $this->mapPhases($item);
        })->flatten(1);

        return $this->respondWithSuccess($filteredData);
    }

    private function mapPhases($item)
    {
        return collect($item['phases'])
            ->sortBy('pivot.phase_id')
            ->map(function ($phase) use ($item) {
                return [
                    'user_name' => $item['user']['name'],
                    'name' => $item['name'],
                    'project_deadline' => \Carbon\Carbon::createFromFormat('Y-m-d', $item['deadline'])->format('d/m/Y'),
                    'phase_name' => $phase['phase_name'],
                    'phase_id' => $phase['pivot']['phase_id'],
                    'project_id' => $phase['pivot']['project_id'],
                    'active' => $phase['pivot']['active'],
                    'deadline' => \Carbon\Carbon::createFromFormat('Y-m-d', $phase['pivot']['deadline'])->format('d/m/Y')
                ];
            });
    }


    public function projectDetails(Project $project)
    {
        $groupedData = $this->groupChecksByPhase($project->id);
        $transformedData = $groupedData->map(function ($items, $phaseId) {
            return [
                'phase_id' => $phaseId,
                'items' => $items->map(function ($item) {
                    return [
                        'id' => $item['id'],
                        'question_checked' => $item['question_checked'],
                        'comment' => $item['comment'],
                        'phase_id' => $item['phase_id'],
                        'question' => $item['checklist_template']['question'],
                    ];
                })->toArray(),
            ];
        })->values()->toArray();

        return $this->respondWithSuccess($transformedData);
    }

    private function groupChecksByPhase($projectId)
    {
        $response = Project::findorfail($projectId)->checklistProjects()->with(['checklistTemplate'])
            ->get();

        $data = json_decode($response, true);
        return $groupedData = collect($data)->groupBy('phase_id');
    }

    public function getProjectPhases(Project $project)
    {
        $response = Project::with('checklistProjects.phase')->where('id', '=', $project->id)->get();

        $data = json_decode($response, true);
        $grouped_checklist_projects = collect($data[0]['checklist_projects'])
            ->groupBy('phase_id')
            ->toArray();

        foreach ($grouped_checklist_projects as $key => $data){
            $grouped_checklist_projects[$key]['total_checks'] = count($data);
            $checked = 0;
            foreach ($data as $phase){
                if ($phase['question_checked'] == 1){
                    $checked++;
                }
            }
            $grouped_checklist_projects[$key]['checked'] = $checked;
            $grouped_checklist_projects[$key]['progress'] = (($checked / $grouped_checklist_projects[$key]['total_checks']) * 100);

        }

        return $this->respondWithSuccess($grouped_checklist_projects);
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
