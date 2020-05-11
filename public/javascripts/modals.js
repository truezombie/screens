function setModalData(modalTitle, modalBody, formAction) {
  $('#modalDeleteTitle').prop('title', modalTitle);
  $('#modalDeleteTitle').text(modalTitle);
  $('#modalDeleteBody').empty().append(modalBody);
  $('#modalDeleteForm').attr('action', formAction);
}

$(document).ready(function () {
  // CITY DELETE MODAL
  $('.btn-open-delete-city-modal').on('click', function () {
    const id = $(this).data('id');
    const city = $(this).data('name');

    const msgModalTitle = `Удаление кассы - ${city}`;
    const msgModalBody = `
      <p>Вы уверенны, что хотите удалить кассу ${city}?<p>
      <small>Удаление кассы, удалит все цветовые схемы которые были к ней прикреплены.</small>`;
    const formAction = `cashboxes/delete/${id}`;

    setModalData(msgModalTitle, msgModalBody, formAction);
  });

  // CITY SCREEN DELETE MODAL
  $('.btn-city-delete-screen-modal').on('click', function () {
    const id = $(this).data('id');
    const screen = $(this).data('screen');

    const msgModalTitle = `Удаление табло "${screen}"`;
    const msgModalBody = `<p>Вы уверенны, что хотите удалить табло "${screen}?<p>`;
    const formAction = `schemas/delete/${id}`;

    setModalData(msgModalTitle, msgModalBody, formAction);
  });

  // CURRENCY DELETE MODAL
  $('.btn-open-delete-currency-modal').on('click', function () {
    const id = $(this).data('id');
    const sale = $(this).data('sale');
    const purchase = $(this).data('purchase');

    const msgModalTitle = `Удаление схемы валюты "${sale} - ${purchase}"`;
    const msgModalBody = `<p>Вы уверенны, что хотите удалить схему валют "${sale} - ${purchase}"?<p>`;
    const formAction = `currencies/delete/${id}`;

    setModalData(msgModalTitle, msgModalBody, formAction);
  });

  // PICTURES DELETE MODAL
  $('.btn-open-delete-picture-modal').on('click', function () {
    const pictureName = $(this).data('name');
    const pictureSystemName = $(this).data('system-name');

    const msgModalTitle = `Удаление картинки "${pictureName}"`;
    const msgModalBody = `<p>Вы уверенны, что хотите удалить картинку "${pictureName}"?<p>`;
    const formAction = `pictures/delete/${pictureSystemName}`;

    setModalData(msgModalTitle, msgModalBody, formAction);
  });

  // BRAND DELETE MODAL
  $('.btn-open-delete-brand-modal').on('click', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');

    const msgModalTitle = `Удаление бренда "${name}"`;
    const msgModalBody = `<p>Вы уверенны, что хотите удалить бренд "${name}"?<p>`;
    const formAction = `brands/delete/${id}`;

    setModalData(msgModalTitle, msgModalBody, formAction);
  });

  // DELETE HEADER SCREEN SLIDE

  $('.btn-open-delete-screen-slide-header-modal').on('click', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');

    const msgModalTitle = `Удаление слайда "${name} верха курсовки"`;
    const msgModalBody = `<p>Вы уверенны, что хотите удалить слайд "${name}" верха курсовки?<p>`;
    const formAction = `/screens/delete-header-screen/${id}`;

    setModalData(msgModalTitle, msgModalBody, formAction);
  });

  // DELETE BODY SCREEN SLIDE

  $('.btn-open-delete-screen-slide-body-modal').on('click', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');

    const msgModalTitle = `Удаление слайда "${name} средины курсовки"`;
    const msgModalBody = `<p>Вы уверенны, что хотите удалить слайд "${name}" средины курсовки?<p>`;
    const formAction = `/screens/delete-body-screen/${id}`;

    setModalData(msgModalTitle, msgModalBody, formAction);
  });

  // DELETE FOOTER SCREEN SLIDE

  $('.btn-open-delete-screen-slide-footer-modal').on('click', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');

    const msgModalTitle = `Удаление слайда "${name} низа курсовки"`;
    const msgModalBody = `<p>Вы уверенны, что хотите удалить слайд "${name}" низа курсовки?<p>`;
    const formAction = `/screens/delete-footer-screen/${id}`;

    setModalData(msgModalTitle, msgModalBody, formAction);
  });

  // DELETE SCREEN
  $('.btn-open-delete-screen-modal').on('click', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');
    
    const msgModalTitle = `Удаление экрана "${name}"`;
    const msgModalBody = `<p>Вы уверенны, что хотите удалить экран "${name}" ?<p>`;
    const formAction = `screens/delete/${id}`;

    setModalData(msgModalTitle, msgModalBody, formAction);
  });
});
