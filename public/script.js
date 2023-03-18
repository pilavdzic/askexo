$(document).ready(function() {
	displayResponses();
    $("#btnSubmit").click(function() {
        $('.spinner-border').show();
        var query = $("#query").val()
        $.ajax({
            type: "POST",
            timeout: 300000,
            url: "/btnSubmit",
            data: {
                query: query
            },
			dataType: "json",
            success: function(response) {
                $('.spinner-border').hide();
                const q = response.query;
				const r = response.response;
				const dataAsString = JSON.stringify({query: q, response: r});
				const key = CryptoJS.SHA256(r).toString();
				displayResponses();
				sessionStorage.setItem(key, dataAsString);
                $('#response').text(r);
            },
            error: function(xhr, status, error) {
                console.log(error);
                $('.spinner-border').hide();
            }
        });
    });
});

var loadIndex = function() {
    // Get an array of all the keys in sessionStorage
    let output = [];
	const keys = Object.keys(sessionStorage);
	console.log('number of keys: '+ keys.length);
    // Loop through the keys and get the corresponding values
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = sessionStorage.getItem(key);
		const parsedValue = JSON.parse(value);
		console.log(parsedValue.query + ' --- ' + parsedValue.response);
        output.push({query: parsedValue.query, response: parsedValue.response});
    }
	return output;
}

function displayResponses() {
  console.log('displaying responses...');
  responses = loadIndex();
  const $pastResponses = $('#past-responses');
  $pastResponses.empty();
  

  // Iterate over each object in the array and create a <p> element for each query-response pair
  responses.forEach((response) => {
    const $query = $('<p>').html(`<strong><em>${response.query}</em></strong>`);
    const $response = $('<p>').text(response.response);
    $pastResponses.append($query, $response);
  });

  // Append the <div> element to the body
  $('body').append($pastResponses);
}




