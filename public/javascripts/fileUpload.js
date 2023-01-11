FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
);

FilePond.setOptions({
  // 这里的比例是 展示图片的比例
  stylePanelAspectRatio: 150 / 100,
  // 更改 上传上服务器的宽高
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150,
});

FilePond.parse(document.body);
