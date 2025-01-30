<?php

namespace App\Http\Resources;

use App\Http\Resources\Web\UserNameAndIdResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserManagementIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'gender' => $this->gender,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'creator' => new UserNameAndIdResource($this->creator),
            'updater' => new UserNameAndIdResource($this->updater),
            'permissions' => $this->getAllPermissions()->pluck('name'), // Include
        ];
    }
}
