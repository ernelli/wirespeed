more off

%index = 2
%index = 200
index = 372
index = 50

%src = 'images0';
src = 'images1';

prev0 = imageY(imread(sprintf('%s/image%d.jpg', src, index)));
index = index + 1;
curr =  imageY(imread(sprintf('%s/image%d.jpg', src, index)));
index = index + 1;

% active BG image
bgimage = uint8(zeros(size(curr)));

% coverage mask
bgmask  = logical(zeros(size(curr)));
bgfull = 0;


%%%% calculate transfer function
if 0

[M,N] = size(curr);

%M = 5
%N = 5

T = zeros(1,256);
S = zeros(1,256);

for m = 16:M
  for n = 1:N
            T(1+prev0(m,n)) += double(curr(m,n));
            S(1+prev0(m,n)) += 1;
   end
end

T(S > 0) = T(S > 0) ./ S(S > 0);


figure(1);
plot(T, 'o');

return
end 
%%%%%%%%%%%%%%%%%%%

while index < 5000
disp(sprintf('processing image %d', index));

prev1 = prev0;
prev0 = curr;
curr = imageY(imread(sprintf('%s/image%d.jpg', src, index)));

index = index + 1;

match0 = imageMatch(curr, prev0);
match1 = imageMatch(curr, prev1);

match = match0 & match1;

if ! bgfull

bgnew = match & !bgmask;

bgimage(bgnew) = curr(bgnew);

bgupp = match & bgmask;

bgimage(bgupp) = 0.1*curr(bgupp) + 0.9*bgimage(bgupp);
bgimage([1:16],:) = curr([1:16],:);

bgmask = bgmask | match;
bgmask([1:16],:) = 0;

  s = sum(sum(bgmask));
  if s >= 103522
    bgfull = 1;
  end

  disp(s);

figure(3);
imshow(bgimage, [0 255]);
%imshow(curr, [0 255]);
pause(0.5);


else

bgimage(match) = 0.1*curr(match) + 0.9*bgimage(match);  
bgimage([1:16],:) = curr([1:16],:);

if 0
imshow(bgimage, [0 255]);
pause(0.5);

else

bgdiff = imageDiff(bgimage, curr);

figure(3);
imshow(bgimage, [0 255]);
pause(0.2)

if 0
imshow(curr, [0 255]);
pause()
hits = curr;
hits(bgdiff) = 255;

figure(3);
imshow(bgdiff, [0 255]);
pause()

figure(3);
imshow(hits, [0 255]);
pause()
end

end % bgfull

end % while loop



if 0

figure(1);
clf;

subplot(4,2,1);
imshow(128*match, [0 255]);

subplot(4,2,2);
imshow(bgimage, [0 255]);

subplot(4,2,3);
imshow(curr, [0 255]);

subplot(4,2,4);
imshow(128*bgmask, [0 255]);


subplot(4,2,5);
imshow(prev0, [0 255]);
subplot(4,2,6);
imshow(128*match0, [0 255]);

subplot(4,2,7);
imshow(prev1, [0 255]);
subplot(4,2,8);
imshow(128*match1, [0 255]);

end

%figure(2);
%imshow(bgimage);
%pause (0.2)

endwhile


figure(1)
clf
imshow(bgimage);
