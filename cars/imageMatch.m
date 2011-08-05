function xe = imageMatch(img0, img1)

doplot = 0;

xe = abs(int16(img0) - int16(img1));

if doplot
figure(1); clf;
subplot(2,2,4);
imshow(uint8(xe), [0 255]);  
end

hg = sum(histc (xe, [0:255])');

if doplot
figure(1);
subplot(2,2,1);
imshow(img0);

subplot(2,2,2);
imshow(img1);

figure(2);
bar(hg);

figure(1)
subplot(2,2,3);
end

maxsum = prod(size(xe));
prevsum = 0;
for T = 4:64
  hsum = sum(hg(1:T+1));
  if prevsum && (hsum-prevsum)/maxsum < 0.01
    break
  end
  prevsum = hsum;
end

  mark = (xe > T);
  
%  csum = maxsum-sum(sum(mark));
%  hsum = sum(hg(1:T+1))

if doplot
  black = img1;
  black(mark) = 0;
  img(:,:,1) = black;
  img(:,:,2) = black;
  blue = img1;
  blue(mark) = 255;
  img(:,:,3) = blue;

  imshow(img);
  pause()
end

end

xe = (xe <= T);

xe = dilate(xe, ones(3,3));
xe = erode(xe, ones(3,3));
disp(sprintf('mark diff > %d, cover: %.2f', T, 100*hsum/maxsum));

if doplot
  black = img1;
  black(!xe) = 0;
  img(:,:,1) = black;
  img(:,:,2) = black;
  blue = img1;
  blue(!xe) = 255;
  img(:,:,3) = blue;

  imshow(img);
  pause()
end



% xe is now stable bg

