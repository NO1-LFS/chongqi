import cv2
import dlib

# 模型路径（确保这个文件在你的代码文件夹里）
predictor_path = "./shape_predictor_68_face_landmarks.dat"

# 初始化检测器
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)

# 打开摄像头
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # 转灰度
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # 检测人脸
    dets = detector(gray)

    for d in dets:
        # 画人脸框
        cv2.rectangle(frame, (d.left(), d.top()), (d.right(), d.bottom()), (0, 255, 0), 2)

        # 检测关键点
        shape = predictor(gray, d)
        for index, pt in enumerate(shape.parts()):
            cv2.circle(frame, (pt.x, pt.y), 1, (0, 255, 0), 2)
            # 可选：显示关键点编号
            cv2.putText(frame, str(index+1), (pt.x, pt.y), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 0, 255), 1)

    # 用 OpenCV 显示（不会报错！）
    cv2.imshow("Face Landmarks", frame)

    # 按 Q 退出
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()

cv2.destroyAllWindows()