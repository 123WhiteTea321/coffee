// index.js
Page({
    data: {
        imageSrc: '../../images/cat.png', // 图片路径
        touchStartX: 0, // 单指触摸的初始 X 坐标
        touchStartY: 0, // 单指触摸的初始 Y 坐标
        translateX: 0, // 图片的 X 轴位移
        translateY: 0, // 图片的 Y 轴位移
        startX: 0, // 触摸的初始 X 坐标（用于计算位移）
        startY: 0, // 触摸的初始 Y 坐标（用于计算位移）
        scale: 1, // 图片的缩放比例
        baseScale: 1 // 基础的缩放比例
    },
  
    handleTouchStart(event) {
      const touch = event.touches[0];
      if (event.touches.length === 1) {
          // 记录单指触摸的初始位置和基础缩放比例
        this.setData({
          touchStartX: touch.clientX,
          touchStartY: touch.clientY,
          startX: touch.clientX,
          startY: touch.clientY,
          baseScale: this.data.scale
        });
      } else if (event.touches.length === 2) {
          // 记录双指触摸的初始距离和基础缩放比例
        const xDistance = event.touches[1].clientX - event.touches[0].clientX;
        const yDistance = event.touches[1].clientY - event.touches[0].clientY;
        const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
        this.setData({
          touchStartX: 0,
          touchStartY: 0,
          startX: 0,
          startY: 0,
          baseScale: this.data.scale,
          startDistance: distance
        });
      }
    },
  
    handleTouchMove(event) {
      const touch = event.touches[0];
      if (event.touches.length === 1) {
           // 单指移动时计算位移并更新图片的位置
        const deltaX = touch.clientX - this.data.startX;
        const deltaY = touch.clientY - this.data.startY;
        this.setData({
          translateX: this.data.translateX + deltaX,
          translateY: this.data.translateY + deltaY,
          startX: touch.clientX,
          startY: touch.clientY
        });
      } else if (event.touches.length === 2) {
           // 双指缩放时根据触摸的距离差计算缩放比例并更新图片的缩放比例
        const xDistance = event.touches[1].clientX - event.touches[0].clientX;
        const yDistance = event.touches[1].clientY - event.touches[0].clientY;
        const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
        const scale = (distance / this.data.startDistance) * this.data.baseScale;
        this.setData({ scale });
      }
    },
  
    handleTouchEnd() {
        // 触摸结束时重置相关数据
      this.setData({
        touchStartX: 0,
        touchStartY: 0,
        startX: 0,
        startY: 0,
        startDistance: 0,
        baseScale: this.data.scale
      });
    }
  });
  