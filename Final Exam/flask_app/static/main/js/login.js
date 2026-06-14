let count     = 0
    function checkCredentials() {
        // package data in a JSON object
        var data_d = {'email': document.getElementById("email").value, 'password': document.getElementById("password").value}

        
        // SEND DATA TO SERVER VIA jQuery.ajax({})
        jQuery.ajax({
            url: "/processlogin",
            data: data_d,
            type: "POST",
            success:function(retruned_data){
                retruned_data = JSON.parse(retruned_data);
                if (retruned_data == 1){
                    window.location.href = "/home";
                }
                if (retruned_data == 0){
                    count += 1;
                    document.getElementById("failed").innerHTML = "attempts failed: "+count;
                }   
                },
        });
    }