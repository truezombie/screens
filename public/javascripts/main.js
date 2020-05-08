$(document).ready(function () {
  $('.colorpicker').spectrum({
    type: 'component',
    showPaletteOnly: true,
    togglePaletteOnly: true,
    showInput: true,
    showInitial: true,
    showAlpha: false,
  });

  $('#uploadImageInput').on('change', function () {
    const fileName = $(this).val().split('\\').pop();
    $(this).siblings('#uploadImageLabel').addClass('selected').html(fileName);
  });
});
