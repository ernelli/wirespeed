function xe = imageDiff(img0, img1)

xe = abs(int16(img0) - int16(img1));

hg = sum(histc (xe, [0:255])');

maxsum = prod(size(xe));
prevsum = 0;
for T = 4:64
  hsum = sum(hg(1:T+1));
  if prevsum && (hsum-prevsum)/maxsum < 0.01
    break
  end
  prevsum = hsum;
end


xe = (xe > T);
disp(sprintf("Threshold %d, cover: %.2f", T, hsum/maxsum));

xe = erode(xe, ones(3,3));
xe = dilate(xe, ones(3,3));


% xe is now stable bg

