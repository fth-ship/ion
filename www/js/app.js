var ion = angular.module('ion', []);
var exec = require('child_process').exec;

function terminalCtrlHandler($scope, $timeout, $log) {
  $scope.$timeout = $timeout;
  $scope.$ps1 = '$ ';
  $scope.stdout = [];
  $scope.stdin = '';

  function stdoutMapHandler(line) {
    var self = this;
    if (line) {
      $scope.stdout.push({ content: line, output: true, history: false, error: (self.err || self.stderr ? true : false) });
    }
  }

  function execHandler(err, stdout, stderr) {
    console.log('exec handler');
    var ctx = {
      err: false,
      stdout: false,
      stderr: false
    };

    if (!err && stdout) {
      ctx.stdout = true;
      stdout.split('\n').map(stdoutMapHandler.bind(ctx));
    } else if (!err && stderr) {
      ctx.stderr = true;
      stderr.split('\n').map(stdoutMapHandler.bind(ctx));
    } else {
      ctx.err = true;
      console.log(err);
    }

    $scope.$digest();
  }

  function sendCommandHandler(input) {
    $scope.stdout.push({ content: input, history: true, output: false });
    $scope.stdin = '';
    
    return exec(input, { cwd: process.env.HOME, env: process.env }, execHandler);
  }
  $scope.sendCommand = sendCommandHandler;
}
ion.controller('TerminalCtrl', terminalCtrlHandler);

angular.bootstrap(document, ['ion']);
