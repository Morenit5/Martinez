import { Injectable } from '@angular/core';
import { HotToastService, ToastOptions } from '@ngxpert/hot-toast';

 @Injectable({
      providedIn: 'root' // Makes the service available throughout the application
})
export class ToastUtility {

    constructor(private toast: HotToastService) { }

    public showToast(msg: string, dur: number = 5000, iconName: string, isSuccess: boolean) {
        const options: ToastOptions<string> = {
            duration: dur, // 5 seconds
            position: 'top-center',
            icon: '<i class="bi bi-' + iconName + '"></i>',
            style: {
                background: isSuccess ? '#586e26' : '#bd002c',
                color: '#fff',
            },
        };

        this.toast.show(msg, options);
    }
}