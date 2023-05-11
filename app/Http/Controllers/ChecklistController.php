<?php

namespace App\Http\Controllers;

use App\Models\ChecklistProject;
use App\Models\Phase;
use App\Models\Project;
use F9Web\ApiResponseHelpers;
use Illuminate\Http\Request;

class ChecklistController extends Controller
{
    use ApiResponseHelpers;


    public function getChecklist(Project $project, Phase $phase)
    {
        $data = ChecklistProject::with('checklistTemplate')
            ->where([
                ['project_id', '=', $project->id],
                ['phase_id', '=', $phase->id]
            ])->get();

        return $this->respondWithSuccess($data);
    }

    public function editChecklist(Project $project, Phase $phase, Request $request)
    {
//        ChecklistProject::where('id', $request->id)
//            ->update(["question_checked" => $request->question_checked]);


        $ids = $request->input('ids');
        $questionChecked = $request->input('question_checked');

        $checksToUpdate = array_combine($ids, $questionChecked);

        foreach ($checksToUpdate as $id => $value) {
            ChecklistProject::where('id', $id)
                ->update(['question_checked' => $value]);
        }
// go to next phase
        $activePhase = Project::where('id', '=', $project->id)
            ->with(['phases'=> fn($q) => $q->where('phase_project.active', '=', 1 )])
            ->get()
            ->toArray();
        $activePhaseId = $activePhase[0]['phases'][0]['id'];

        $checklist = ChecklistProject::where([
            ['project_id', '=', $project->id],
            ['phase_id', '=', $activePhaseId]
        ])->get()->toArray();

        $hasZeroValue = false;
        foreach ($checklist as $check) {
            if ($check["question_checked"] === 0) {
                $hasZeroValue = true;
                break;
            }
        }

        if (!$hasZeroValue && $activePhaseId < 5) {
//            $project->phases()->updateExistingPivot($phase->id, ['active' => 0]);
//            $project->phases()->updateExistingPivot($phase->id + 1, ['active' => 1]);
            $project->phases()->sync([
                $phase->id => ['active' => 0],
                $phase->id + 1 => ['active' => 1]
            ]);
        }

        return $this->respondOk('The checklist has been configured');
    }

}
