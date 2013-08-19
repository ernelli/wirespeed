An thorough explanation of the Discrete Fourier Transform for programmers using JavaScript code.

The first time I encountered the DFT (Discrete Fourier Transform) was when the coolest thing on the planet was the sampling synthesizer...

Now most samplers of that time did not use DFT to process audio, but when reading up on digital audio or signal processing in general, you encounter the Fourier Transform sooner or later.

First, the FFT (Fast Fourier Transform) is the faster variant of the DFT. Both algorithms produce the same result, e.g its like Bubble Sort vs Quick Sort, where the FFT O(N log2 N) is Quick Sort and DFT is Bubble Sort O(N^2).

My intuitive understanding of the FFT at the time was that it decomposes a signal into sine and cosine signals, which when added together reconstructs the original signal. The decomposition is carried out by correlating the original signal with sine and cosine signals whose period is a multiple of the original signals period. So far so good, but I never really understood how the combination of sine and cosine signals could reconstruct any possible waveform.

To fully understand the DFT, we have to start with an introduction to linear algebra.

