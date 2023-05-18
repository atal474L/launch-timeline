<?php

namespace App\Http\Controllers;

use App\Models\ChecklistTemplate;
use App\Models\Phase;
use App\Models\Project;
use Illuminate\Http\Request;
use F9Web\ApiResponseHelpers;
use Illuminate\Http\JsonResponse;
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
        $response = Project::with(['checklistProjects', 'phases'=> fn($q) => $q->where('phase_project.active', '=', 1 )])
            ->orderBy('deadline')
            ->take(10)
            ->get();

        return $this->filterDataForProjectTable($response);
    }

    private function filterDataForProjectTable($response)
    {
        $data = json_decode($response, true);

        foreach ($data as $key => $project) {
            foreach ($project['phases'] as $phase) {
                if ($phase['pivot']['active'] === 1) {
                    $data[$key]['active_phase_id'] = $phase['pivot']['phase_id'];
                    $data[$key]['active_phase_deadline'] = \Carbon\Carbon::createFromFormat('Y-m-d', $phase['pivot']['deadline'])->format('d/m/Y');
                }
            }
        }

        foreach ($data as $key => $project){
            $activeChecks = 0;
            $checked = 0;
            foreach ($project['checklist_projects'] as $checklist){
                if ((array_key_exists('active_phase_id', $project)) && $checklist['phase_id'] == $project['active_phase_id']){
                    $activeChecks++;
                    if ($checklist['question_checked'] == 1){
                        $checked++;
                    }
                }
            }
            $data[$key]['progress'] = (($checked / $activeChecks * 10000)/100);
        }
        return $this->respondWithSuccess($data);
    }


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
        $template = ChecklistTemplate::select('id', 'phase_id')->get();
        $attributes = $template->map(function ($item) {
            return [
                'checklist_template_id' => $item->id,
                'phase_id' => $item->phase_id,
                'question_checked' => 0,
                'comment' => ''
            ];
        })->all();


        $project = new Project($request->all());
        $project->user_id = $request->user_id;
        $project->save();

        Project::findorfail($project->id)->phases()->sync($request->phases);

        Project::findorfail($project->id)->checklistProjects()->createMany($attributes);

        //return response()->json(['message' => 'The project has been created'], 201);
        return $this->respondOk('The project has been created');
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
        //$findProject = Project::findOrFail($project->id)->makeHidden(['name', 'state', 'deadline', 'created_at', 'updated_at', 'deleted_at', 'user_id']);

        $data = Project::with('phases', 'user')->findOrFail(['id'=> $project->id]);

        $filteredData = collect(json_decode($data, true))->map(function ($item) {
            $phases = collect($item['phases'])->map(function ($phase) use ($item) {
                return [
                    'user_name' => $item['user']['name'],
                    'name' => $item['name'],
                    'project_deadline' => $item['deadline']= \Carbon\Carbon::createFromFormat('Y-m-d', $item['deadline'])->format('d/m/Y'),
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
