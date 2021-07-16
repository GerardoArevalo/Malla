<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use Illuminate\Support\Str;
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->get('/key', function () {
    return Str::random(32);
});

$router->group(['namespace' => 'Data'], function () use ($router) {
    // Using The "App\Http\Controllers\Data" Namespace...

    $router->get('moodle/{id}', 'UserDataController@getMoodle');

    $router->get('moodle/{moodleid}/user/{userid}/courses', 'UserDataController@getUserCourses');

    $router->get('moodle/{moodleid}/course/{courseid}/activities', 'CourseDataController@getCourseActivities');

    $router->get('moodle/{moodleid}/course/{courseid}/groups', 'CourseDataController@getCourseGroups');
});

$router->group(['namespace' => 'Crud'], function () use ($router) {
    // Using The "App\Http\Controllers\Edit" Namespace...

    $router->get('course/{id}/structures', 'StructureController@getAllStructuresByCourseId');

    $router->get('structure/{id}', 'StructureController@read');

    $router->post('structure', 'StructureController@create');

    $router->put('structure', 'StructureController@update');

    $router->delete('structure/{id}', 'StructureController@delete');

    $router->get('structure/{id}/itemcategories', 'ItemCategoryController@getItemCategoriesByStructureId');

    $router->get('itemcategory/{id}', 'ItemCategoryController@read');

    $router->get('itemcategory/{id}/items', 'ItemController@getItemsByItemCategoryId');

    $router->post('item', 'ItemController@create');

    $router->put('item', 'ItemController@update');

    $router->delete('item/{id}', 'ItemController@delete');

    $router->get('item/{id}/activities', 'ActivityController@getActivitiesByItemId');

    $router->post('activity', 'ActivityController@create');

    $router->delete('activity/{id}', 'ActivityController@delete');
});

$router->group(['namespace' => 'Grade'], function () use ($router) {
    // Using The "App\Http\Controllers\Grade" Namespace...

    $router->get('structure/{id}/grades', 'GradeController@getGrades');
    $router->get('structure/{id}/grades/final', 'GradeController@getFinalGrades');
    $router->get('structure/{id}/grades/retrieve', 'GradeController@updateAllItemGradesByStructure');
    $router->get('structure/{structureId}/item/{itemId}/grades/retrieve', 'GradeController@updateItemGrades');
    $router->put('grade', 'GradeController@gradeItemManually');
});
