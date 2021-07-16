<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMallaActivities extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('malla_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained('malla_items')->onDelete('cascade');
            $table->string('name');
            $table->string('modname');
            $table->bigInteger('instance');
            $table->bigInteger('cmid');
            $table->string('url');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('malla_activities');
    }
}
