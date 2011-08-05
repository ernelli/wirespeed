function Y = imageY(img)

R = 0.299;
G = 0.587;
B = 0.114;

Y = R*img(:,:,1)+G*img(:,:,2)+B*img(:,:,3);
