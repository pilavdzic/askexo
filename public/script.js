$(document).ready(function() {
    $("#btnSubmit").click(function() {
        $('.spinner-border').show();
        const query = $('.query-input').val();
		$('.query-input').val('');
		generateNewParagraph(query, 'query');
        $.ajax({
            type: "POST",
            timeout: 300000,
            url: "/btnSubmit",
            data: {
                query: query
            },
			dataType: "json",
            success: function(response) {
				console.log(response);
                $('.spinner-border').hide();
                const q = response.query;
				const r = response.response;
				const dataAsString = JSON.stringify({query: q, response: r});
				const key = CryptoJS.SHA256(r).toString();
				sessionStorage.setItem(key, dataAsString);
                generateNewParagraph(r, 'response')
            },
            error: function(xhr, status, error) {
                console.log(error);
                $('.spinner-border').hide();
            }
        });
    });
});

function generateNewParagraph(txt, type) {
  const $p = $('<p>').text(txt);
  if (type === 'response') {
    $p.addClass('alternate');
  }
  const $chatRecord = $('.chat-record');
  $chatRecord.append($p);
  $chatRecord.scrollTop($chatRecord.prop('scrollHeight'));
}
