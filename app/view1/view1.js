'use strict';

angular.module('myApp.view1', ['ngRoute', 'ui.tinymce','ngSanitize','ngStorage', 'plunker'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$timeout', '$sessionStorage','$window','fileReader',  function($scope, $timeout, $sessionStorage, $window, fileReader) {
  /*$scope.tinymceModel = 'Initial content';
  $scope.contents = [];*/
      console.log('nnn ',$window.sessionStorage.getItem('contents') );

   if(!$window.sessionStorage.getItem('contents')) {
        $scope.contents = [{"id":"dragme0","htmlcontent":"<p>Initial content2</p>","position":{"left":"99px","top":"259px"}},{"id":"dragme1","htmlcontent":"<p>Initial content</p>","position":{"left":"99px","top":"383px"}}];
        $window.sessionStorage.setItem('contents', JSON.stringify($scope.contents));
   } else {
        $scope.contents = JSON.parse($window.sessionStorage.getItem('contents'));
   }

   $scope.viewpdf =  function () {
       html2canvas(document.getElementById('exportthis'), {
           onrendered: function (canvas) {
               var data = canvas.toDataURL();
               var docDefinition = {
                   content: [{
                       image: data,
                       width: 500,
                   }]
               };
              // console.log('docDefinition created ', JSON.stringify(docDefinition));
               pdfMake.createPdf(docDefinition).download("test.pdf");
           },
           logging: true
       });
   }

   $scope.imageSrc = "./CertificateAttendScholarLabRev02192016.png";

   $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
            .then(function(result) {
              $scope.imageSrc = result;
            });
   };

   $scope.$on("fileProgress", function(e, progress) {
        $scope.progress = progress.loaded / progress.total;
   });

  $scope.getContent = function() {
    console.log('Editor content:', $scope.tinymceModel);
  };

  $scope.setContent = function() {
    $scope.tinymceModel = 'Time: ' + (new Date());
  };

  $scope.getaside = function(contentid, index) {
    $scope.tinymceModel = $scope.contents[index].htmlcontent;
    $scope.content =  $scope.contents[index];
    $scope.content.index = index;
  };

  $scope.deleteaside = function(contentid, index) {
        $scope.contents.splice(index,1);
        $window.sessionStorage.setItem('contents', JSON.stringify($scope.contents));
        location.reload(true);
  }

  $scope.tinymceOptions = {
    plugins: 'link image code',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | mybutton',
    setup: function(editor) {
      //Focus the editor on load
      // $timeout(function(){ editor.focus(); });
      editor.addButton('mybutton', {
        type: 'listbox',
        text: 'My listbox',
        icon: false,
        onselect: function (e) {
          //editor.insertContent(this.value());
          console.log('i m clicked ',$scope.tinymceModel);
          $scope.tinymceModel = this.value();
          var temp = "dragme"+ $scope.contents.length;
          $scope.contents.push({"id":temp,"htmlcontent":this.value(),"position":{"left":"99px","top":"259px"}})
          $scope.$apply();
          $window.sessionStorage.setItem('contents', JSON.stringify($scope.contents));
          location.reload(true);
        },
        values: [
          { text: '{{username}}', value: '<p>{{username}}</p>' },
          { text: '{{coursename}}', value: '<p>{{coursename}}</p>' },
          { text: '{{result}}', value: '<p>{{result}}</p>' }
        ]/*,
        onPostRender: function () {
          // Select the second item by default
          this.value('&nbsp;<em>Some italic text!</em>');
        }*/
      });
/*      editor.addButton('mybutton', {
        text: 'New',
        icon: false,
        onclick: function () {
          //editor.insertContent('&nbsp;<b>It\'s my button!</b>&nbsp;');
          console.log('i m clicked ',$scope.tinymceModel);
          $scope.tinymceModel = 'New Content';
          var temp = "dragme"+ $scope.contents.length;
          $scope.contents.push({"id":temp,"htmlcontent":"<p>New Content</p>","position":{"left":"99px","top":"259px"}})
          $scope.$apply();
          $window.sessionStorage.setItem('contents', JSON.stringify($scope.contents));
          location.reload(true);
        }
      });*/
      editor.on("init", function() {
        for(var i = 0; i< $scope.contents.length; i++) {
          console.log('$scope.contents[i].id ',$scope.contents[i].id)
          var dm = document.getElementById($scope.contents[i].id);
          console.log('dm ',i,' ',dm)
          dm.removeEventListener("dragstart", drag_start);
          dm.addEventListener('dragstart',drag_start,false);
          dm.style.left = $scope.contents[i].position.left;
          dm.style.top = $scope.contents[i].position.top;
        }
        document.body.addEventListener('dragover',drag_over,false);
        document.body.addEventListener('drop',drop,false);
        //$scope.tinymceModel = 'Initial content';

        //$scope.contents = [{"id":"dragme0","htmlcontent":"<p>Initial content2</p>","position":{"left":"99px","top":"259px"}},{"id":"dragme1","htmlcontent":"<p>Initial content</p>","position":{"left":"-8px","top":"283px"}}];
        //$scope.tinymceModel = 'Initial content';
        /*var content = {};
        content.htmlcontent = editor.getContent();*/
      });
      editor.on("change", function() {
        // console.log('Editor content:', $scope.tinymceModel);
        console.log('Editor content2:', editor.getContent());
        if($scope.content) {
          $scope.contents[$scope.content.index].htmlcontent = editor.getContent();
          $window.sessionStorage.setItem('contents', JSON.stringify($scope.contents));
        }

        //$scope.contents = [{"id":"dragme0","htmlcontent":"<p>Initial content2</p>","position":{"left":"99px","top":"259px"}},{"id":"dragme1","htmlcontent":"<p>Initial content</p>","position":{"left":"-8px","top":"283px"}}];
        /*for(var i = 0; i< $scope.contents.length; i++) {
          console.log('$scope.contents[i].id ',$scope.contents[i].id)
          var dm = document.getElementById($scope.contents[i].id);
          console.log('dm ',i,' ',dm)
          dm.removeEventListener("dragstart", drag_start);
          dm.addEventListener('dragstart',drag_start,false);
          dm.style.left = $scope.contents[i].position.left;
          dm.style.top = $scope.contents[i].position.top;
        }*/
        /*$scope.content = {};
        $scope.content.htmlcontent = editor.getContent();

        if(!$scope.content.position) {
          $scope.content.position = {};
          $scope.content.position.left = "99px";
          $scope.content.position.top = "259px";
          var dm = document.getElementById('dragme');
          dm.style.left = $scope.content.position.left;
          dm.style.top = $scope.content.position.top;

        }*/
        /*var dm = document.getElementById('dragme');
        $scope.content.position.left = dm.style.left;
        $scope.content.position.top = dm.style.top;*/
        console.log('$scope.content is',$scope.contents)
      });
      /*var edObj = editor.dom.getRoot();
      editor.dom.setStyle(edObj, 'background-image', "url(http://dsba.scholarlab.com/_contentfiles/dsba/files/CertificateAttendScholarLabRev02192016.png)");*/
    }
  };
      function drag_start(event) {
        console.log('event start ',event);
        var style = window.getComputedStyle(event.target, null);
        console.log('style is ',event.target, ' ',style);
        console.log('set Data is ',parseInt(style.getPropertyValue("left"),10),' ',event.clientX, ' ',parseInt(style.getPropertyValue("top"),10), ' ',event.clientY)
        event.dataTransfer.setData("text/plain",
            (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY) + ','+event.target.id);
      }
      function drag_over(event) {
        console.log('event stop ',event);
        event.preventDefault();
        return false;
      }
      function drop(event) {
        console.log('event over ',event);
        var offset = event.dataTransfer.getData("text/plain").split(',');
        console.log('offset is ',offset,' ',event.clientX,' ',event.clientY);
        var dm = document.getElementById(offset[2]);
        var dm2 = document.getElementById('dragregion');
        dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
        dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
        var temp =0;
        for( var i =0; i < $scope.contents.length; i++) {
          if($scope.contents[i].id == offset[2]) {
            temp = i;
            break;
          }
        }
        $scope.contents[temp].position.left = dm.style.left;
        $scope.contents[temp].position.top = dm.style.top;
        console.log('$scope.content is',$scope.contents)
        $window.sessionStorage.setItem('contents', JSON.stringify($scope.contents));
        /*dm.style.left = ((event.clientX + parseInt(offset[0],10))/(dm2.clientWidth) *(100)) + '%';
         dm.style.top = ((event.clientY + parseInt(offset[1],10))/(dm2.clientHeight) *(100)) + '%';*/
        event.preventDefault();
        return false;
      }
      console.log('script started')
      /*var dm = document.getElementById('dragme');
      /!*var dm2 = document.getElementById('dragregion');
       console.log('HWLT ',dm2.clientHeight, '  ',dm2.clientWidth, ' ',dm2.clientLeft,' ',dm2.clientTop)*!/
      dm.addEventListener('dragstart',drag_start,false);
      document.body.addEventListener('dragover',drag_over,false);
      document.body.addEventListener('drop',drop,false);*/
      /*for(var i = 0; i< $scope.contents.length; i++) {
        console.log('$scope.contents[i].id ',$scope.contents[i].id)
        var dm = document.getElementById($scope.contents[i].id);
        /!*var dm2 = document.getElementById('dragregion');
         console.log('HWLT ',dm2.clientHeight, '  ',dm2.clientWidth, ' ',dm2.clientLeft,' ',dm2.clientTop)*!/
        dm.addEventListener('dragstart',drag_start,false);
        document.body.addEventListener('dragover',drag_over,false);
        document.body.addEventListener('drop',drop,false);

      }*/
}])

.directive("ngFileSelect",function(){

  return {
    link: function($scope,el){

      el.bind("change", function(e){
        console.log('e is ',JSON.stringify(e))

        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      })

    }

  }


});

