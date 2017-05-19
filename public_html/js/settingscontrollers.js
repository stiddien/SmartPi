smartpi.controller('MainCtrl', function($scope, $rootScope, $mdDialog, UserData, $GetConfigData) {

        $scope.smartpi = {};
        $scope.smartpi.location = {};

        $scope.measurement = {};
        $scope.measurement.current = {};
        $scope.measurement.current.phase1 = {};
        $scope.measurement.current.phase2 = {};
        $scope.measurement.current.phase3 = {};
        $scope.measurement.current.phase4 = {};

        $scope.measurement.voltage = {};
        $scope.measurement.voltage.phase1 = {};
        $scope.measurement.voltage.phase2 = {};
        $scope.measurement.voltage.phase3 = {};

        $scope.mqtt = {};
        $scope.ftp = {};
        $scope.mobile = {};
        $scope.csv = {};

        $scope.database = {};
        $scope.database.database = {};
        $scope.database.counter = {};
        $scope.webserver = {};




        $scope.tabview = false;
        $scope.toggleTab = function() {
            $scope.tabview = !$scope.tabview;
        }



        $scope.user = {};


        $scope.showSaveButton = function(button) {
            switch (button) {
                case 'default':
                    $scope.isDefaultSave = true;
                    break;
                case 'measurement':
                    $scope.isMeasurementSave = true;
                    break;
                case 'mqtt':
                    $scope.isMqttSave = true;
                    break;
                case 'ftp':
                    $scope.isFtpSave = true;
                    break;
                case 'mobile':
                    $scope.isMobileSave = true;
                    break;
                case 'expert':
                    $scope.isExpertSave = true;
                    break;

                default:
            }
        }

        $scope.hideSaveButton = function(button) {
            switch (button) {
                case 'default':
                    $scope.isDefaultSave = false;
                    break;
                case 'measurement':
                    $scope.isMeasurementSave = false;
                    break;
                case 'mqtt':
                    $scope.isMqttSave = false;
                    break;
                case 'ftp':
                    $scope.isFtpSave = false;
                    break;
                case 'mobile':
                    $scope.isMobileSave = false;
                    break;
                case 'expert':
                    $scope.isExpertSave = false;
                    break;

                default:
            }
        }


        $scope.saveConfiguration = function(config) {
            console.log("Save " + config);
            $scope.isDefaultSave = true;
        }

        $scope.showLogin = function(ev) {
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'templates/loginDialogSettings.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: false,
                    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

        $rootScope.$on("LoginDialogCloseEvent", function(event, args) {

            var encrypted = CryptoJS.SHA256(args.password).toString();
            $GetConfigData(encrypted).query({},
                function(data) {
                    $scope.tabview = true;
                    console.log(data);
                    $scope.smartpi.serial = data.Serial;
                    $scope.smartpi.name = data.Name;
                    $scope.smartpi.location.lat = data.Lat;
                    $scope.smartpi.location.lng = data.Lng;
                    $scope.measurement.frequency = data.PowerFrequency;
                    $scope.measurement.current.phase1.measure = data.MeasureCurrent.A;
                    $scope.measurement.current.phase2.measure = data.MeasureCurrent.B;
                    $scope.measurement.current.phase3.measure = data.MeasureCurrent.C;
                    $scope.measurement.current.phase4.measure = data.MeasureCurrent.N;
                    $scope.measurement.current.phase1.sensor = data.CTType.A;
                    $scope.measurement.current.phase2.sensor = data.CTType.B;
                    $scope.measurement.current.phase3.sensor = data.CTType.C;
                    $scope.measurement.current.phase4.sensor = data.CTType.N;
                    $scope.measurement.frequency = data.PowerFrequency;
                    $scope.measurement.current.phase1.direction = data.CurrentDirection.A;
                    $scope.measurement.current.phase2.direction = data.CurrentDirection.B;
                    $scope.measurement.current.phase3.direction = data.CurrentDirection.C;
                    // $scope.measurement.current.phase4.measure = data.CurrentDirection.N;
                    $scope.measurement.voltage.phase1.measure = data.MeasureVoltage.A;
                    $scope.measurement.voltage.phase2.measure = data.MeasureVoltage.B;
                    $scope.measurement.voltage.phase3.measure = data.MeasureVoltage.C;
                    $scope.measurement.voltage.phase1.suppose = data.Voltage.A;
                    $scope.measurement.voltage.phase2.suppose = data.Voltage.B;
                    $scope.measurement.voltage.phase3.suppose = data.Voltage.C;
                    $scope.mqtt.enabled = data.MQTTenabled;
                    $scope.mqtt.brokerUrl = data.MQTTbroker;
                    $scope.mqtt.brokerPort = data.MQTTbrokerport;
                    $scope.mqtt.username = data.MQTTuser;
                    $scope.mqtt.password = data.MQTTpass;
                    $scope.mqtt.topic = data.MQTTtopic;
                    $scope.ftp.enabled = data.FTPupload;
                    $scope.ftp.serverurl = data.FTPserver;
                    $scope.ftp.path = data.FTPpath;
                    $scope.ftp.username = data.FTPuser;
                    $scope.ftp.password = data.FTPpass;
                    $scope.mobile.enabled = data.MobileEnabled;
                    $scope.mobile.apn = data.MobileAPN;
                    $scope.mobile.pin = data.MobilePIN;
                    $scope.mobile.username = data.MobileUser;
                    $scope.mobile.password = data.MobilePass;
                    $scope.csv.decimalpoint = data.CSVdecimalpoint;
                    $scope.csv.timeformat = data.CSVtimeformat;
                    $scope.database.database.directory = data.DatabaseDir;
                    $scope.database.database.enabled = data.DatabaseEnabled;
                    $scope.database.counter.enabled = data.CounterEnabled;
                    $scope.database.counter.directory = data.CounterDir;
                    $scope.webserver.port = data.WebserverPort;
                },
                function(error) {
                    if (error.status == 400)
                        $scope.tabview = false;
                    $scope.showLogin();
                    console.log(error.data.message);
                });



            $scope.user.name = args.username;
            $scope.user.password = args.password;
        });

        function DialogController($scope, $rootScope, $mdDialog, UserData) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.LoginSettings = function() {
                $rootScope.$emit("LoginDialogCloseEvent", {
                    username: $scope.user.name,
                    password: $scope.user.password
                });
                $mdDialog.hide();
            };

            // Set the default value of inputType
            $scope.inputType = 'password';
            $scope.showHidePassword = 'Show password';

            // Hide & show password function
            $scope.hideShowPassword = function() {
                if ($scope.inputType == 'password') {
                    $scope.inputType = 'text';
                    $scope.showHidePassword = 'Hide password';
                } else {
                    $scope.inputType = 'password';
                    $scope.showHidePassword = 'Show password';
                }
            };



        }



    })
    .factory('UserData', function() {

        var data = {
            username: '',
            password: ''
        };

        return {
            getUsername: function() {
                return data.userName;
            },
            setUsername: function(userName) {
                data.userName = userName;
            },
            getPassword: function() {
                return data.password;
            },
            setUsername: function(password) {
                data.password = password;
            }
        };
    });
