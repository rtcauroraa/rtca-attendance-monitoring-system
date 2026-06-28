<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          Role::create(['name' => 'SuperAdmin']);
          Role::create(['name' => 'Admin']);
          Role::create(['name' => 'User']);
          Role::create(['name' => 'Alpha']);
          Role::create(['name' => 'Bravo']);
          Role::create(['name' => 'Charlie']);
          Role::create(['name' => 'Delta']);
    }
}
