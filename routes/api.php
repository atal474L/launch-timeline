<?php

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


Route::get('homeproject', [\App\Http\Controllers\ProjectController::class, 'getHomeProject']);
Route::get('toptenprojects', [\App\Http\Controllers\ProjectController::class, 'getTopTenProjects']);

Route::get('projectoverview', [\App\Http\Controllers\ProjectController::class, 'getProjectOverview']);

Route::post('projects', [\App\Http\Controllers\ProjectController::class, 'storeProject']);
Route::get('project/checklist/template/{project}', [\App\Http\Controllers\ProjectController::class, 'getProjectChecklistTemplate']);
Route::put('project/checklist/template/{project}', [\App\Http\Controllers\ProjectController::class, 'configureProjectChecklistTemplate']);

Route::get('projects/{project}/timeline', [\App\Http\Controllers\ProjectController::class, 'projectTimeline']);
Route::get('projects/{project}/details', [\App\Http\Controllers\ProjectController::class, 'projectDetails']);

Route::get('projects/{project}/phases', [\App\Http\Controllers\ProjectController::class, 'getProjectPhases']);

Route::get('teams', [\App\Http\Controllers\Controller::class, 'getTeams']);

Route::get('projects/{project}/phases/{phase}/checklist', [\App\Http\Controllers\ChecklistController::class, 'getChecklist']);
Route::put('projects/{project}/phases/{phase}/checklist', [\App\Http\Controllers\ChecklistController::class, 'editChecklist']);





Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


