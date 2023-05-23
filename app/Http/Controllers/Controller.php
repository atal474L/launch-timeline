<?php

namespace App\Http\Controllers;

use App\Models\User;
use F9Web\ApiResponseHelpers;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, ApiResponseHelpers;

    public function getTeams()
    {
        $teams = User::pluck('name', 'id');

        return $this->respondWithSuccess($teams);
    }
}
