<?php

namespace Deployer;

set('repository', 'git@bitbucket.org:teslaamazing/v2.git');
set('keep_releases', 2);
set('default_stage', 'staging');
set('ssh_multiplexing', true);
set('ssh_type', 'native');
set('http_user', 'teslaamazing');

host('teslaamazing.com')
    ->stage('staging')
    ->user('teslaamazing')
    ->identityFile('~/.ssh/id_rsa')
    ->set('deploy_path', '/var/www/teslaamazing/data/www/customizer.teslaamazing.com');

// Tasks

task('hotfix', function () {

    if (ask('Git commit', 0)) {
        $message = ask('Message', 'hotfix #' . time());
        runLocally('git add .');
        runLocally('git commit -m "' . $message . '"');
        runLocally('git push');
    }

    cd("{{deploy_path}}/current");
    run("git pull");

});
