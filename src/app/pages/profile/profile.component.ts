import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/128',
    bio: 'Frontend developer passionate about creating intuitive user experiences.',
    location: 'New York, NY',
    joinDate: 'January 2023',
    stats: {
      projects: 12,
      followers: 245,
      following: 189
    }
  };

  profileSections = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Full Name', value: this.user.name },
        { label: 'Email', value: this.user.email },
        { label: 'Location', value: this.user.location },
        { label: 'Member Since', value: this.user.joinDate }
      ]
    },
    {
      title: 'Account Settings',
      fields: [
        { label: 'Privacy', value: 'Public Profile' },
        { label: 'Notifications', value: 'Enabled' },
        { label: 'Two-Factor Auth', value: 'Enabled' },
        { label: 'Language', value: 'English' }
      ]
    }
  ];

  onEditProfile() {
    console.log('Edit profile clicked');
  }

  onChangePassword() {
    console.log('Change password clicked');
  }

  onDeleteAccount() {
    console.log('Delete account clicked');
  }
}
