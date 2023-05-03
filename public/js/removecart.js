function removeFromCart(productId) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/remove-from-cart');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
      if (xhr.status === 200) {
        window.location.reload();
      }
    };
    xhr.send(JSON.stringify({ productId }));
  }