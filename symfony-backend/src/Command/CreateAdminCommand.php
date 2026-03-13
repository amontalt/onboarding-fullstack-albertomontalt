<?php

namespace App\Command;

use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-admin',
    description: 'Crea un usuario administrador por defecto si no existe.'
)]
final class CreateAdminCommand extends Command
{
    private const ADMIN_EMAIL = 'admin@example.com';
    private const ADMIN_PASSWORD = 'password123';

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    // --- NUEVO MÉTODO CONFIGURE (RETO) ---
    // Aquí definimos qué banderas (opciones) acepta el comando y cuáles son sus valores por defecto
    protected function configure(): void
    {
        $this
            ->addOption('email', null, InputOption::VALUE_OPTIONAL, 'Email del admin', self::ADMIN_EMAIL)
            ->addOption('password', null, InputOption::VALUE_OPTIONAL, 'Contraseña temporal', self::ADMIN_PASSWORD)
            ->addOption('roles', null, InputOption::VALUE_OPTIONAL, 'Roles separados por coma', 'ROLE_ADMIN,ROLE_USER');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // --- LECTURA DE OPCIONES (RETO) ---
        // Leemos lo que el usuario ha escrito en la consola. Si no ha escrito nada, cogerá los valores por defecto.
        $email = (string) $input->getOption('email');
        $passwordPlano = (string) $input->getOption('password');
        
        // Los roles vienen como un texto "ROLE_ADMIN,ROLE_USER", lo separamos en un array
        $rolesString = (string) $input->getOption('roles');
        $roles = array_map('trim', explode(',', $rolesString));

        $nombre = 'Administrador Personalizado';

        $io->title('Creación de administrador por defecto');
        $io->text(sprintf('Email objetivo: %s', $email));

        $usuarioExistente = $this->entityManager
            ->getRepository(Usuario::class)
            ->findOneBy(['email' => $email]);

        if ($usuarioExistente) {
            $io->warning('Ya existe un usuario con ese email. No se realizaron cambios.');
            return Command::SUCCESS;
        }

        $usuario = (new Usuario())
            ->setEmail($email)
            ->setNombre($nombre)
            ->setRoles($roles); // Pasamos el array de roles que hemos leído

        $usuario->setPassword($this->passwordHasher->hashPassword($usuario, $passwordPlano));

        $this->entityManager->persist($usuario);
        $this->entityManager->flush();

        $io->success(sprintf('Administrador %s creado correctamente. Cambia la contraseña al iniciar sesión.', $email));

        return Command::SUCCESS;
    }
}