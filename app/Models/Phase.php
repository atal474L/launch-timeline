<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Phase extends Model
{
    use HasFactory;

    public function projects(): BelongsTo
    {
        $this->belongsTo(Project::class);
    }

    public function checklists(): HasMany
    {
        $this->hasMany(Checklist::class);
    }
}
