<?php

namespace App\Controller;

use App\Repository\TareaRepository;
use App\Service\TareaManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[Route('/api/tasks')]
class TaskController extends AbstractController
{
    public function __construct(
        private readonly TareaManager $tareaManager,
        private readonly TareaRepository $tareaRepository,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    #[Route('', name: 'api_tasks_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $usuario = $this->getUser();
        $usuarioId = $usuario?->getId() ?? (int) $request->query->get('usuarioId', 1);

        $filtros = [
            'estado' => $request->query->get('estado'),
            'texto' => $request->query->get('q'),
        ];

        $tareas = $this->tareaManager->listarPorUsuario($usuarioId, $filtros);

        return $this->json($tareas);
    }

    #[Route('', name: 'api_tasks_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $usuario = $this->getUser();
        $usuarioId = $usuario?->getId()
            ?? $request->query->getInt('usuarioId', $request->request->getInt('usuarioId', 1));

        $content = $request->getContent();
        $payload = json_decode($content, true);
        
        // --- MINI RETO 3 (Parte 1): Validar JSON inválido ---
        if ($content !== '' && $payload === null) {
            throw new BadRequestHttpException('El JSON enviado es inválido.'); // Devuelve un error 400
        }
        $payload = $payload ?? [];
        // ----------------------------------------------------

        $usuarioObj = $this->entityManager->getReference('App\Entity\Usuario', $usuarioId);
        $tarea = $this->tareaManager->crear($payload, $usuarioObj);

        return $this->json($tarea, JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_tasks_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $usuario = $this->getUser();
        $usuarioId = $usuario?->getId()
            ?? $request->query->getInt('usuarioId', $request->request->getInt('usuarioId', 1));

        $tarea = $this->tareaManager->aseguraPerteneceAUsuario(
            $this->tareaRepository->find($id),
            $usuarioId
        );

        $payload = json_decode($request->getContent(), true) ?? [];
        $tarea = $this->tareaManager->actualizar($tarea, $payload);

        // --- MINI RETO 3 (Parte 2A): Mensaje personalizado al actualizar ---
        return $this->json([
            'message' => 'Tarea actualizada correctamente',
            'tarea' => $tarea
        ]);
        // -------------------------------------------------------------------
    }

    #[Route('/{id}/status', name: 'api_tasks_change_status', methods: ['PATCH'])]
    public function changeStatus(int $id, Request $request): JsonResponse
    {
        $usuario = $this->getUser();
        $usuarioId = $usuario?->getId()
            ?? $request->query->getInt('usuarioId', $request->request->getInt('usuarioId', 1));

        $tarea = $this->tareaManager->aseguraPerteneceAUsuario(
            $this->tareaRepository->find($id),
            $usuarioId
        );

        $payload = json_decode($request->getContent(), true) ?? [];
        $tarea = $this->tareaManager->cambiarEstado($tarea, $payload['estado'] ?? '');

        return $this->json($tarea);
    }

    #[Route('/{id}', name: 'api_tasks_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request): JsonResponse
    {
        $usuario = $this->getUser();
        $usuarioId = $usuario?->getId()
            ?? $request->query->getInt('usuarioId', $request->request->getInt('usuarioId', 1));

        $tarea = $this->tareaManager->aseguraPerteneceAUsuario(
            $this->tareaRepository->find($id),
            $usuarioId
        );

        $this->tareaManager->eliminar($tarea);

        // --- MINI RETO 3 (Parte 2B): Mensaje personalizado al eliminar ---
        return $this->json(['message' => 'Tarea eliminada'], JsonResponse::HTTP_OK);
        // -----------------------------------------------------------------
    }
}