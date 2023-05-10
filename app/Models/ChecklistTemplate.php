<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChecklistTemplate extends Model
{
    use HasFactory;

    protected $table = 'checklist_templates';

    protected $fillable = [
        'question',

    ];

    public function phase(): BelongsTo
    {
        return $this->belongsTo(Phase::class);
    }

    public function checklistProjects(): HasMany
    {
        return $this->hasMany(ChecklistProject::class);
    }

//    public function projects(): BelongsToMany
//    {
//        return $this->belongsToMany(Project::class)->withPivot('question_checked', 'comment');;
//    }
}
