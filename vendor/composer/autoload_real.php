<?php

// autoload_real.php @generated by Composer

class ComposerAutoloaderInitb2a767e1488d0b1f96f7a4f14c1811d9
{
    private static $loader;

    public static function loadClassLoader($class)
    {
        if ('Composer\Autoload\ClassLoader' === $class) {
            require __DIR__ . '/ClassLoader.php';
        }
    }

    /**
     * @return \Composer\Autoload\ClassLoader
     */
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        spl_autoload_register(array('ComposerAutoloaderInitb2a767e1488d0b1f96f7a4f14c1811d9', 'loadClassLoader'), true, true);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader(\dirname(__DIR__));
        spl_autoload_unregister(array('ComposerAutoloaderInitb2a767e1488d0b1f96f7a4f14c1811d9', 'loadClassLoader'));

        require __DIR__ . '/autoload_static.php';
        call_user_func(\Composer\Autoload\ComposerStaticInitb2a767e1488d0b1f96f7a4f14c1811d9::getInitializer($loader));

        $loader->register(true);

        return $loader;
    }
}