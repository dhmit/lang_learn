# Generated by Django 3.1.5 on 2021-02-05 18:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='text',
            old_name='text',
            new_name='content',
        ),
        migrations.AddField(
            model_name='text',
            name='definitions',
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
        migrations.AddField(
            model_name='text',
            name='examples',
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
        migrations.AlterField(
            model_name='text',
            name='images',
            field=models.JSONField(blank=True, default=dict, null=True),
        ),
    ]
