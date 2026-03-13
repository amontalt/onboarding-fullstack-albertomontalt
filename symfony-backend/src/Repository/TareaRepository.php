<?php

namespace App\Repository;

use App\Entity\Tarea;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Tarea>
 */
class TareaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tarea::class);
    }

    //    /**
    //     * @return Tarea[] Returns an array of Tarea objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('t.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Tarea
    //    {
    //        return $this->createQueryBuilder('t')
    //            ->andWhere('t.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    /**
     * Devuelve todas las tareas de un usuario ordenadas de la más reciente a la más antigua.
     *
     * @return Tarea[]
     */
    public function findByUsuarioOrdenadas(int $usuarioId): array
    {
        $qb = $this->createQueryBuilder('t');

        return $qb
            ->andWhere('t.usuario = :usuarioId')
            ->setParameter('usuarioId', $usuarioId)
            ->orderBy('t.fechaCreacion', 'DESC')
            ->getQuery()
            ->getResult();
    }

/**
     * Busca tareas por usuario, permitiendo filtrar opcionalmente por estado y texto.
     *
     * @return Tarea[]
     */
    public function buscarPorFiltros(int $usuarioId, ?string $estado, ?string $texto): array
    {
        $qb = $this->createQueryBuilder('t')
            ->andWhere('t.usuario = :usuarioId')
            ->setParameter('usuarioId', $usuarioId);

        if ($estado) {
            $qb->andWhere('t.estado = :estado')
               ->setParameter('estado', $estado);
        }

        if ($texto) {
            $qb->andWhere('LOWER(t.titulo) LIKE :texto OR LOWER(t.descripcion) LIKE :texto')
               ->setParameter('texto', '%' . mb_strtolower($texto) . '%');
        }

        return $qb->orderBy('t.fechaCreacion', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Encuentra las tareas de un usuario que están 'pendientes' y vencen dentro del intervalo indicado.
     *
     * @return Tarea[]
     */
    public function findPendientesPorVencer(int $usuarioId, \DateInterval $intervalo): array
    {
        $limite = (new \DateTimeImmutable())->add($intervalo);

        return $this->createQueryBuilder('t')
            ->andWhere('t.usuario = :usuario')
            ->andWhere('t.estado = :estado')
            ->andWhere('t.fechaLimite IS NOT NULL')
            ->andWhere('t.fechaLimite <= :limite')
            ->setParameter('usuario', $usuarioId)
            ->setParameter('estado', 'pendiente')
            ->setParameter('limite', $limite)
            ->orderBy('t.fechaLimite', 'ASC')
            ->getQuery()
            ->getResult();
    }

    
}
