<?php
namespace Deployer;

require 'recipe/common.php';

// Project name
set('application', 'teslaamazing-customizer');

// Project repository
set('repository', 'git@github.com:tiamo/teslaamazing-customizer.git');

// [Optional] Allocate tty for git clone. Default value is false.
set('git_tty', true); 

// Shared files/dirs between deploys 
set('shared_files', []);
set('shared_dirs', []);

// Writable dirs by web server 
set('writable_dirs', []);


// Hosts

host('teslaamazing.com')
//    ->stage('staging')
    ->user('teslaamazing')
    ->identityFile('~/.ssh/id_rsa')
    ->set('deploy_path', '/var/www/teslaamazing/data/www/customizer.teslaamazing.com');

// Tasks

desc('Hotfix');
task('hotfix', function () {

    if ($message = ask('Git commit', 'hotfix #' . time())) {
        runLocally('git add .');
        runLocally('git commit -m "' . $message . '"');
        runLocally('git push');
    }

    cd("{{deploy_path}}/current");
    run("git pull");

});

desc('Deploy your project');
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:writable',
//    'deploy:vendors',
    'deploy:clear_paths',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
    'success'
]);

// [Optional] If deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');
