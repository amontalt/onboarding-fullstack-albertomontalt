<?php

namespace App\Repository;

use App\Entity\Usuario;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<Usuario>
 */
class UsuarioRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Usuario::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof Usuario) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    /**
     * Busca usuarios cuyo email o nombre contenga el término indicado.
     *
     * @return Usuario[]
     */
    public function buscarPorEmailONombre(?string $term): array
    {
        // Si no se indica término, devolvemos todos los usuarios ordenados por id ascendente
        if ($term === null || trim($term) === '') {
            return $this->createQueryBuilder('u')
                ->orderBy('u.id', 'ASC')
                ->getQuery()
                ->getResult();
        }

        $normalizado = '%' . mb_strtolower($term) . '%';

        return $this->createQueryBuilder('u')
            ->andWhere('LOWER(u.email) LIKE :term OR LOWER(u.nombre) LIKE :term')
            ->setParameter('term', $normalizado)
            ->orderBy('u.nombre', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Devuelve un conteo global de tareas agrupadas por su estado.
     *
     * @return array
     */
    public function contarTareasPorEstado(): array
    {
        return $this->createQueryBuilder('u')
            ->innerJoin('u.tareas', 't')
            ->select('t.estado AS estado, COUNT(t.id) AS total')
            ->groupBy('t.estado')
            ->getQuery()
            ->getArrayResult();
    }
}