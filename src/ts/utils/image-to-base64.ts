export function getBase64(file: File, fn: (data: string) => void) {
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = function () {
    if (reader.result) {
      fn(reader.result.toString());
    }
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}