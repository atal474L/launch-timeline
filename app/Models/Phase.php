<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Phase extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];


    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class)
            ->withPivot('deadline', 'active')
            ->withTimestamps();
    }

    public function checklistTemplates(): HasMany
    {
        return $this->hasMany(ChecklistTemplate::class);
    }

    public function projectChecklists(): HasManyThrough
    {
        return $this->hasManyThrough(ChecklistProject::class, ChecklistTemplate::class);
    }

    public function chosenChecklist(): HasMany
    {
        return $this->hasMany(ChecklistProject::class);
    }
//
//    public function posts(): HasManyThrough
//    {
//        return $this->hasManyThrough(Post::class, SocialMediaAccount::class);
//    }

}
