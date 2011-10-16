(setq scroll-step 1)
(custom-set-variables
  ;; custom-set-variables was added by Custom.
  ;; If you edit it by hand, you could mess it up, so be careful.
  ;; Your init file should contain only one such instance.
  ;; If there is more than one, they won't work right.
 '(c-basic-offset 2)
 '(confirm-kill-emacs (quote yes-or-no-p))
 '(indent-tabs-mode nil)
 '(js2-basic-offset 4)
 '(standard-indent 4))
(custom-set-faces
  ;; custom-set-faces was added by Custom.
  ;; If you edit it by hand, you could mess it up, so be careful.
  ;; Your init file should contain only one such instance.
  ;; If there is more than one, they won't work right.
 )
(if window-system (global-font-lock-mode t))
(setq font-lock-maximum-decoration t)

(defun trim-leading-space ()
  "Removes spaces from point until non space"
  (interactive())

  (while (or (equal (char-after) 32) (equal (char-after) 9) )
    (delete-char 1))
)

(global-set-key "\M-a" 'trim-leading-space)

(defun copy-line ()
  "Copies from point to end of line into kill buffer"
  (interactive())
  (setq start-pos (point)  )
  (end-of-line)
  (copy-region-as-kill start-pos (point) )

)

;; Hook for future expansion
(defun mad-cmode-hook ()
  (c-set-offset 'case-label c-basic-offset)
;;  (c-set-offset 'substatement-open c-basic-offset)
;;  (c-set-style

)

(add-hook 'c-mode-common-hook 'mad-cmode-hook)



(global-set-key "\M-g" 'goto-line)
(global-set-key "\M- " 'set-mark-command)
(global-set-key "\M-k" 'copy-line)


(global-set-key "\M-[1~" 'beginning-of-buffer)
(global-set-key "\M-[4~" 'end-of-buffer)


(add-to-list 'load-path "~/.emacs.d/site-lisp/")
(autoload 'js2-mode "js2" nil t)
(add-to-list 'auto-mode-alist '("\\.js$" . js2-mode))
