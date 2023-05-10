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

        $data = json_decode($response, true);

        foreach ($data as $key => $project) {
            foreach ($project['phases'] as $phase) {
                if ($phase['pivot']['active'] === 1) {
                    $data[$key]['active_phase_id'] = $phase['pivot']['phase_id'];
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


        return $this->respondWithSuccess($data);
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

        return response()->json(['message' => 'The project has been created'], 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
