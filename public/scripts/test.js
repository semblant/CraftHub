// Client facing scripts here
$(() => {
  $('#fetch-test').on('click', () => {
    console.log('success')
    $.ajax({
      method: 'GET',
      url: '/api/test'
    })
    .done((response) => {
      const $testList = $('#test');
      $testList.empty();

      for(const test of response.data) {
        console.log(test)
        $(`<li class="test">`).text(test.name).appendTo($testList);
      }
    });
  });
});
