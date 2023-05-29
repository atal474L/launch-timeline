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
        'deadline',
        'user_id'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function phases(): BelongsToMany
    {
        return $this->belongsToMany(Phase::class)
            ->withPivot('deadline', 'active')
            ->withTimestamps();
    }

    public function checklistProjects(): HasMany
    {
        return $this->hasMany(ChecklistProject::class);
    }



//    public function checklistTemplates(): BelongsToMany
//    {
//        return $this->belongsToMany(ChecklistTemplate::class)->withPivot('question_checked', 'comment');;
//    }
}
