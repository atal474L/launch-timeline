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
        $checklistProjects = ChecklistProject::with('checklistTemplate')
            ->where('project_id', $project->id)
            ->where('phase_id', $phase->id)
            ->get();

        $filteredData = $checklistProjects->map(function ($item) {
            return [
                'id' => $item->id,
                'question_checked' => $item->question_checked,
                'question' => $item->checklistTemplate->question
            ];
        })->toArray();

        return $this->respondWithSuccess($filteredData);
    }



    public function editChecklist(Project $project, Phase $phase, Request $request)
    {
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
            $project->phases()->updateExistingPivot($phase->id, ['active' => 0]);
            $project->phases()->updateExistingPivot($phase->id + 1, ['active' => 1]);
        }
        if (!$hasZeroValue && $activePhaseId === 5) {
            $project->state = 'inactive';
            $project->save();
        }

        return $this->respondOk('The checklist has been configured');
    }

}
