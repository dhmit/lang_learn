# Generated by Django 3.1.5 on 2021-01-21 17:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_auto_20210121_1652'),
    ]

    operations = [
        migrations.AlterField(
            model_name='text',
            name='text',
            field=models.TextField(max_length=2000, null=True),
        ),
    ]
