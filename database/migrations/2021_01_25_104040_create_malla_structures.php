<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMallaStructures extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('malla_structures', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('moodle_id')->constrained('malla_moodles');
            $table->integer('courseid');
            $table->enum('mode', ['group', 'course']);
            $table->string('mode_value')->default("");
            $table->boolean('graded')->default(false);
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
        Schema::dropIfExists('malla_structures');
    }
}
