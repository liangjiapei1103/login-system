
(function ($, doc, undefined) {
    $.fn.createMultiple = function (params) {
        var defaults = {
            fileContainer: '',
            height: 20,
            width: 20,
            inputfile: '',
            filesize: 1000,
            filetype: 1,
            photofiles: ['png','jpg','gif'],
            otherfiles: []

        };
        var options = $.extend(defaults, params);
        if (options.fileContainer == "") {
            throw  new Error("The style is Empty!");
        }
        if (options.inputfile == "") {
            throw new Error("The inputFile Id is Empty!");
        }
        if (typeof options.filetype != "number") {
            throw new Error("The file type must be Number And can't be empty!");
        }
        var fileContainer = $('#' + options.fileContainer), inputFile = doc.getElementById(options.inputfile), fileTempLate = "<img src={0} height={1} width={2}>",
            emum = {
                photo: 1,
                other: 2
            };
        /***type file is Photos***/
        var showPhoto = function () {
                if (inputFile.files) {
                    appendImage(inputFile.files);
                }
            },
            /***types file is others***/
            showOther = function () {
                alert("to be continued!")
            },
            appendImage = function (files) {
                var sizeStr="",typeStr="";
                for (var i = 0, len = files.length; i < len; i++) {
                    if (files[i].size / 1000 > options.filesize) {
                        sizeStr+=files[i].name;
                        sizeStr+="、";
                        continue;
                    }
                    if (options.photofiles.indexOf(files[i].name.substring(files[i].name.lastIndexOf('.') + 1, files[i].name.length)) == -1) {
                        typeStr+=files[i].name;
                        typeStr+="、";
                        continue;
                    }
                    var reader = new FileReader();
                    reader.readAsDataURL(files[i]);
                    reader.onload = function (e) {
                        var img = this.result;
                        fileContainer.html(fileContainer.html() + String.imgFormat(fileTempLate, img, options.height, options.width));
                    }
                }
                if(sizeStr){
                    alert(sizeStr+" are too large,Must be smaller than ‘" + options.filesize + "KB’");
                }
                if(typeStr){
                    alert('Does is not support this kind of type:'+typeStr);
                }
            }

        $('#' + options.inputfile).bind('change', function () {
            switch (options.filetype) {
                case emum.photo:
                    showPhoto();
                    break;
                case emum.other:
                    break;
                    showOther();
                default:
                    alert("The fileType is undefined!");
            }
        });
        $(document).on({
            dragleave: function (e) {
                e.preventDefault();
                fileContainer.removeClass('over');
            },
            drop: function (e) {
                e.preventDefault();
                fileContainer.removeClass('over');
            },
            dragenter: function (e) {
                e.preventDefault();
                fileContainer.addClass('over');
            },
            dragover: function (e) {
                e.preventDefault();
                fileContainer.addClass('over');
            }
        });
        doc.getElementById(options.fileContainer).addEventListener('drop', function (e) {
            e.preventDefault();
            if (e.dataTransfer.files) {
                appendImage(e.dataTransfer.files);
            }

        }, false);
    }
})(window.jQuery, window.document);
String.imgFormat = function (str) {
    for (var i = 1; i < arguments.length; i++) {
        str = str.replace(new RegExp("\\{" + (i - 1) + "\\}", "g"), arguments[i] != undefined ? arguments[i] : "");
    }
    return str;
};