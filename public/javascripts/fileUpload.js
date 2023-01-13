const rootStyles = window.getComputedStyle(document.documentElement);
if (rootStyles.getPropertyValue("--book-cover-width-large")) {
  ready();
} else {
  document.getElementById("main-css").addEventListener("load", ready);
}

function ready() {
  const coverWidth = parseFloat(
    rootStyles.getPropertyValue("--book-cover-width-large"),
  );
  const coverAspectRatio = parseFloat(
    rootStyles.getPropertyValue("--book-cover-aspect-ratio"),
  );
  const coverHeight = coverWidth / coverAspectRatio;

  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  );

  FilePond.setOptions({
    // 这里的比例是 展示图片的比例
    stylePanelAspectRatio: 1 / coverAspectRatio,
    // 更改 上传上服务器的宽高
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150,
  });

  FilePond.parse(document.body);
}
