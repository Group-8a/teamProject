(function () {
  'use strict';

  describe('Recruiters Route Tests', function () {
    // Initialize global variables
    var $scope,
      RecruitersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RecruitersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RecruitersService = _RecruitersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('recruiters');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/recruiters');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          RecruitersController,
          mockRecruiter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('recruiters.view');
          $templateCache.put('modules/recruiters/client/views/view-recruiter.client.view.html', '');

          // create mock Recruiter
          mockRecruiter = new RecruitersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Recruiter Name'
          });

          // Initialize Controller
          RecruitersController = $controller('RecruitersController as vm', {
            $scope: $scope,
            recruiterResolve: mockRecruiter
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:recruiterId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.recruiterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            recruiterId: 1
          })).toEqual('/recruiters/1');
        }));

        it('should attach an Recruiter to the controller scope', function () {
          expect($scope.vm.recruiter._id).toBe(mockRecruiter._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/recruiters/client/views/view-recruiter.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RecruitersController,
          mockRecruiter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('recruiters.create');
          $templateCache.put('modules/recruiters/client/views/form-recruiter.client.view.html', '');

          // create mock Recruiter
          mockRecruiter = new RecruitersService();

          // Initialize Controller
          RecruitersController = $controller('RecruitersController as vm', {
            $scope: $scope,
            recruiterResolve: mockRecruiter
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.recruiterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/recruiters/create');
        }));

        it('should attach an Recruiter to the controller scope', function () {
          expect($scope.vm.recruiter._id).toBe(mockRecruiter._id);
          expect($scope.vm.recruiter._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/recruiters/client/views/form-recruiter.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RecruitersController,
          mockRecruiter;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('recruiters.edit');
          $templateCache.put('modules/recruiters/client/views/form-recruiter.client.view.html', '');

          // create mock Recruiter
          mockRecruiter = new RecruitersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Recruiter Name'
          });

          // Initialize Controller
          RecruitersController = $controller('RecruitersController as vm', {
            $scope: $scope,
            recruiterResolve: mockRecruiter
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:recruiterId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.recruiterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            recruiterId: 1
          })).toEqual('/recruiters/1/edit');
        }));

        it('should attach an Recruiter to the controller scope', function () {
          expect($scope.vm.recruiter._id).toBe(mockRecruiter._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/recruiters/client/views/form-recruiter.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
