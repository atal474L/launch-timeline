<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::get('home-project', [ProjectController::class, 'getHomeProject']);
Route::get('top-ten-projects', [ProjectController::class, 'getTopTenProjects']);

Route::get('projects-overview', [ProjectController::class, 'getProjectsOverview']);

Route::post('projects', [ProjectController::class, 'storeProject']);
Route::put('projects/{project}', [ProjectController::class, 'updateProject']);

Route::get('projects/{project}/checklist/template', [ProjectController::class, 'getProjectChecklistTemplate']);
Route::put('projects/{project}/checklist/template', [ProjectController::class, 'configureProjectChecklistTemplate']);

Route::get('projects/{project}/timeline', [ProjectController::class, 'getProjectTimeline']);
Route::get('projects/{project}/details', [ProjectController::class, 'getProjectDetails']);
Route::get('projects/{project}/phases', [ProjectController::class, 'getProjectPhases']);

Route::get('teams', [\App\Http\Controllers\Controller::class, 'getTeams']);

Route::get('projects/{project}/phases/{phase}/checklist', [\App\Http\Controllers\ChecklistController::class, 'getChecklist']);
Route::put('projects/{project}/phases/{phase}/checklist', [\App\Http\Controllers\ChecklistController::class, 'editChecklist']);





Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


