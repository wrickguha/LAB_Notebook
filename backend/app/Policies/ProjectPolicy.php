<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\ResearchProjectAccess;
use App\Models\User;

class ProjectPolicy
{
    public function view(User $user, Project $project): bool
    {
        if ($project->user_id === $user->id) {
            return true;
        }

        return $project->accessList()
            ->where('user_id', $user->id)
            ->exists();
    }

    public function update(User $user, Project $project): bool
    {
        if ($project->user_id === $user->id) {
            return true;
        }

        $access = $project->accessList()
            ->where('user_id', $user->id)
            ->first();

        return $access && $access->access_level >= ResearchProjectAccess::LEVEL_EDIT;
    }

    public function delete(User $user, Project $project): bool
    {
        return $project->user_id === $user->id;
    }

    public function share(User $user, Project $project): bool
    {
        if ($project->user_id === $user->id) {
            return true;
        }

        $access = $project->accessList()
            ->where('user_id', $user->id)
            ->first();

        return $access && $access->access_level >= ResearchProjectAccess::LEVEL_ADMIN;
    }
}
