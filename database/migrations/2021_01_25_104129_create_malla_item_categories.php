<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMallaItemCategories extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('malla_item_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('structure_id')->constrained('malla_structures')->onDelete('cascade');
            $table->enum('name', ['Evaluación Continua 1 (EC)', 'Evaluación Continua 2 (EP)', 'Evaluación del Profesor (EPF)', 'Evaluación Final (EF)']);
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
        Schema::dropIfExists('malla_item_categories');
    }
}
