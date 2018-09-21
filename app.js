//app.js
App({
  onLaunch: function () {
    /**
     * 更新管理器
     */
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '更新失败，试试重启应用？',
        showCancel: false,
        success(res) {
          updateManager.applyUpdate()
        }
      })
    })
  },
  globalData: {
    userInfo: null
  },
  loading(){
    wx.showLoading({
      title: 'Loading...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  loadend(){
    wx.hideLoading();
  }
})