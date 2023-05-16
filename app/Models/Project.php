<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'state',
        'deadline',

    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function phases(): BelongsToMany
    {
        return $this->belongsToMany(Phase::class)->withPivot('deadline', 'active');;
    }

    public function checklistProjects(): HasMany
    {
        return $this->hasMany(ChecklistProject::class);
    }

    public function getFormattedPivotDateAttribute()
    {
        $pivot = $this->pivot;

        // Check if the pivot exists and contains the 'deadline' attribute
        if ($pivot && isset($pivot->deadline)) {
            $date = $pivot->deadline;

            // Convert the date format
            $formattedDate = \Carbon\Carbon::createFromFormat('Y-m-d', $date)->format('d/m/Y');

            return $formattedDate;
        }

        return null;
    }

//    public function checklistTemplates(): BelongsToMany
//    {
//        return $this->belongsToMany(ChecklistTemplate::class)->withPivot('question_checked', 'comment');;
//    }
}
